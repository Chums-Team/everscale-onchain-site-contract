import { getRandomNonce } from "locklift";
import {Command} from "commander";
import fs from "fs";

const minify = require('html-minifier').minify;

const program = new Command();

const MESSAGE_SIZE = 60 * 1000;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const TEXT_HTML = "text/html";
const TEXT_CSS = "text/css";

async function main() {
  program
      .allowUnknownOption()
      .option("-t, --content_type <content_type>", "uploaded content type")
      .option("-s, --charset <charset>", "uploaded content type charset")
      .option("-f, --file <path_to_file>", "file to upload")
      .parse(process.argv);

  const options = program.opts();
  console.log(options);

  let contentType = options.content_type || TEXT_HTML;
  const charset = options.charset || "utf-8";
  const file = options.file;

  if (!file) {
    throw new Error("File is not provided");
  }
  if (!fs.existsSync(file)) {
    throw new Error(`Provided file '${file}' does not exist`);
  }
  // Onchain storage of the site's HTML content is suggested primarily as a proof of concept.
  // Until BigCell or DriveChain are implemented, its use may be limited.
  if (fs.statSync(file).size > MAX_FILE_SIZE) {
    throw new Error(`File '${file}' is too large. Max size is 2MB`);
  }

  console.log(`Reading file: ${file} with content type: ${contentType} and charset: ${charset}`);

  const data = fs.readFileSync(file, charset);

  if (!data) {
    throw new Error(`File '${file}' is empty`);
  }

  if (contentType === TEXT_HTML) {
    console.log(`Minifying HTML content`);
  }

  const minified_data  = contentType === TEXT_HTML ?
    minify(data, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    })
  : data;

  let chunks = [];
  for (let i = 0; i < minified_data.length; i += MESSAGE_SIZE) {
      chunks.push(minified_data.slice(i, i + MESSAGE_SIZE));
  }

  console.log(`File '${file}' contains ${chunks.length} chunks`);

  console.log('Deploying Eversite contract')

  if (contentType === TEXT_HTML || contentType === TEXT_CSS) {
    contentType = `${contentType}; charset=${charset}`;
  }

  const signer = (await locklift.keystore.getSigner("0"))!;
  const { contract: site, tx } = await locklift.factory.deployContract({
    contract: "Eversite",
    publicKey: signer.publicKey,
    constructorParams: {
      contentType: contentType
    },
    initParams: { _randomNonce: getRandomNonce() },
    value: locklift.utils.toNano(3),
  });

  console.log(`Eversite deployed at: ${site.address.toString()}. Transaction: ${tx.transaction.id.hash}`);

  console.log('Uploading file to Eversite contract');

  const cellAbi = [{name: 'value', type: 'string'}] as const;

  for (let i = 0; i < chunks.length; i++) {
    const {boc, hash} = await locklift.provider.packIntoCell({
      structure: cellAbi,
      data: {value: chunks[i]}
    });
    const {transaction: tx} = await site.methods
        .upload({'index': i, 'part': boc})
        .sendExternal({
          publicKey: signer.publicKey,
          withoutSignature: false,
        });
    if (!tx || tx.aborted) {
      throw new Error('Failed to upload chunk. Message expired');
    }
    console.log(`Chunk ${i + 1}/${chunks.length} uploaded. Transaction: ${tx.id.hash}`);
  }

  console.log('File uploaded successfully');
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });

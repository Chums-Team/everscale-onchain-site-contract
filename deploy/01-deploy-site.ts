import { getRandomNonce, toNano } from "locklift";

export default async () => {
  const signer = await locklift.keystore.getSigner('0');

  await locklift.deployments.deploy({
    deployConfig: {
      contract: "Eversite",
      publicKey: signer!.publicKey,
      initParams: { _randomNonce: getRandomNonce() },
      constructorParams: { contentType:null },
      value: locklift.utils.toNano(1)
    },
    deploymentName: "eversite",
    enableLogs: true,
  });
};

export const tag = "site";
import type { AstroConfig, AstroIntegration } from "astro";

//
// config opts
// 1. callback fn to fetch data
// 2. { fromVar: "varName", toVar: "varName" }

// Can we perform regex on it?

type TPluginOpts = {
  callback: () => Record<string, string>;
  accessors: {
    fromVar: string;
    toVar: string;
  };
};

const PKG_NAME = "astro-fetch-redirects";

function createPlugin(opts: TPluginOpts): AstroIntegration {
  return {
    name: PKG_NAME,
    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        console.log(config);
        if (!config.experimental?.redirects) {
          throw new Error(
            "This plugin requires the experimental redirects feature to be enabled"
          );
        }

        /*         updateConfig({
          vite: {
            plugins: [bananaCSS()]
          }
        }); */
      }
    }
  };
}

export default createPlugin;

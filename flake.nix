{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    nix-capsule.url = "gitlab:codnixus/nix-capsule?ref=v0.8.0";
  };

  outputs =
    inputs:
    (import ./template.nix) {
      inherit inputs;

      devShell = {
        image = "mcr.microsoft.com/playwright:v1.62.0-noble";
        socketPath = "/tmp/devspace/ncap-socket";
        containerName = "devspace";
        extraOptions = [
          "-e"
          "PNPM_HOME"
          "-v"
          "$PNPM_HOME:$PNPM_HOME"
          "-p"
          "127.0.0.1:4321:4321"
          "-p"
          "127.0.0.1:3001:3001"
          "-v"
          "ms-playwright:/ms-playwright"
          "--pid=host"
        ];
        wrappers = [
          "pnpm"
           {
            name = "astro-ls";
            value = "node_modules/.bin/astro-ls";
          }
          {
            name = "typescript-language-server";
            value = "node_modules/.bin/typescript-language-server";
          }
          {
            name = "tailwindcss-language-server";
            value = "node_modules/.bin/tailwindcss-language-server";
          }
          {
            name = "prettier";
            value = "pnpm exec prettier";
          }
          {
            name = "playwright-cli";
            value = "pnpm exec playwright-cli";
          }
        ];
        preShellHook = ''
          export PNPM_HOME=''${PNPM_HOME:-$HOME/.local/share/pnpm}
          mkdir -p "$PNPM_HOME"
        '';
      };

      container =
        pkgs:
        pkgs.mkShellNoCC {
          packages = with pkgs; [
            nodejs-slim
            pnpm

            caddy

            skills
            git
          ];
        };
    };
}

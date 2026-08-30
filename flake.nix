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
        image = "ubuntu:latest";
        socketPath = "/tmp/devspace/ncap-socket";
        containerName = "devspace";
        extraOptions = [
          "-e"
          "PNPM_HOME"
          "-v"
          "$PNPM_HOME:$PNPM_HOME"
          "-p"
          "127.0.0.1:4321:4321"
        ];
        wrappers = [
          "pnpm"
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
            cacert

            skills
            git
          ];
        };
    };
}

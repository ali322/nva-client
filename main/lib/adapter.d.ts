export declare const install: (pkgs:any[], path: string, registry: string) => void

declare const download: (repo: string, dest: string) => Promise<void>

declare const updater: (options: any) => any
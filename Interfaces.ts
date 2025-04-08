interface commandInterface {
  name: string;
  description: string;
  type: string;
  permissions: string[];
  execute: (interaction: any) => Promise<void>;
}

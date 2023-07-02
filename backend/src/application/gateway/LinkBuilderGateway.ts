export default interface LinkBuilderGateway {
  generateLink(id: string): Promise<string>;
}

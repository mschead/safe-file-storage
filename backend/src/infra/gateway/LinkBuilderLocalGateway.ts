import LinkBuilderGateway from 'src/application/gateway/LinkBuilderGateway';

export default class LinkBuilderLocalGateway implements LinkBuilderGateway {
  private LINK_BASE = 'http://localhost:4000/upload-content';

  generateLink(id: string): Promise<string> {
    return Promise.resolve(`${this.LINK_BASE}/${id}`);
  }
}

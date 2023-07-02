export default interface DatabaseConnection {
  connect(): Promise<void>;
  query(statement: string, params?: Array<string | number | null>): Promise<any>;
  close(): Promise<void>;
}

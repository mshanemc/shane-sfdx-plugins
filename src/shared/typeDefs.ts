interface Record {
  attributes: object;
  Id: string;

  ContentDocumentId?: string;
}

interface QueryResult {
  totalSize: number;
  done: boolean;
  records: Record[];
}

interface CreateResult {
  id: string;
  success: boolean;
  errors: string[];
  name: string;
  message: string;
}

export { Record, QueryResult, CreateResult };

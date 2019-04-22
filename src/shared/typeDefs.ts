interface Record {
  attributes: object;
  Id: string;
  Name?: string;

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

interface CustomLabel {
  fullName: string;
  value: string;
  protected: boolean;
  categories?: string;
  shortDescription?: string;
  language?: string;
}

interface WaveDataset {
  name: string;
  currentVersionId: string;
  createdBy: {
    name: string;
  };
  datasetType: string;
  id: string;
}

interface WaveDatasetVersion {

  xmdMain: {
    dates: [
      {
        alias: string;
        fields: {
          fullField: string;
        }
      }
    ],
    dimensions: [
      {
        field: string;
      }
    ],
    measures: [
      {
        field: string;
      }
    ]
  };
}

interface WaveDataSetListResponse {
  datasets: WaveDataset[];
}

interface CDCEvent {
  schema: string;
  payload: {
    ChangeEventHeader: {
      entityName: string;
      changeType: string;
      recordIds: string[];
    }
  };
  event: {
    replayId: number
  };
}

export { Record, QueryResult, CreateResult, CustomLabel, WaveDataSetListResponse, WaveDatasetVersion, CDCEvent };

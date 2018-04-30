import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import localFile2CV = require('../../../../shared/localFile2CV');

core.Messages.importMessagesDirectory(join(__dirname, '..', '..', '..'));
// const messages = core.Messages.loadMessages('shane-sfdx-plugins', 'org');

export default class Upload extends SfdxCommand {

  public static description = 'upload a file from local resources, optionally as a chatter post or attached file on a record';

  public static examples = [
    `sfdx shane:data:file:upload - f ~/Downloads/King.png
    //uploads file from local filesystem as a file
    `,
    `sfdx shane:data:file:upload - f ~/Downloads/King.png -p 0011900000VkJgrAAF
    //uploads file from local filesystem as a file and attaches to a record
    `,
    `sfdx shane:data:file:upload - f ~/Downloads/King.png -p 0011900000VkJgrAAF -c
    //uploads and attaches it to the indicated record, but as a chatter file post
    `,
    `sfdx shane:data:file:upload - f ~/Downloads/King.png -p 0011900000VkJgrAAF -n CustomName -c
    //uploads and attaches it to the indicated record, but as a chatter file post with a name that's not the same name as the local filesystem used
    `
  ];

  protected static flagsConfig = {
    file: flags.string({ char: 'f', description: 'path to file on local filesystem', required: true }),
    parentId: flags.string({ char: 'p', description: 'optional record ID that the file should be attached to' }),
    chatter: flags.boolean({ char: 'c', description: 'attach as a chatter content post instead of just as a file' }),
    name: flags.string({ char: 'n', description: 'set the name of the uploaded file' })

  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  // protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // const name = this.flags.name || 'world';

    // potential errors
    if (this.flags.chatter && !this.flags.parentId) {
      this.ux.error('you have to supply parentId if you use the --chatter flag');
    }

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    // const query = 'Select Name, TrialExpirationDate from Organization';

    interface ContentVersionCreateRequest {
      VersionData: string;
      PathOnClient: string;
      Title?: string;
    }

    interface CreateResult {
      id: string;
      success: boolean;
      errors: string[];
      name: string;
      message: string;
    }

    interface CDLCreateRequest {
      ContentDocumentId: string;
      LinkedEntityId: string;
      ShareType: string;
    }

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

    const CV = <Record> await localFile2CV.file2CV(conn, this.flags.file, this.flags.name);

    if (!this.flags.chatter) {
      // regular file attachment
      this.ux.log(`will create a regular file attachment on record ${this.flags.parentId}`);

      const CDLReq = {
        ContentDocumentId: CV.ContentDocumentId,
        LinkedEntityId: this.flags.parentId,
        ShareType: 'V'
      } as CDLCreateRequest;

      const CDLCreateResult = await conn.sobject('ContentDocumentLink').create(CDLReq) as CreateResult;
      if (CDLCreateResult.success) {
        this.ux.log(`created regular file attachment on record ${this.flags.parentId}`);
      } else {
        this.ux.error(CDLCreateResult.message);
      }
      return CDLCreateResult;
    } else {
      // chatter post
      const feedItemRequest = {
        RelatedRecordId: CV.Id,
        ParentId: this.flags.parentId,
        Type: 'ContentPost'
      };

      const feedItemCreateResult = await conn.sobject('FeedItem').create(feedItemRequest) as CreateResult;
      if (feedItemCreateResult.success) {
        this.ux.log(`created chatter file attachment on record ${this.flags.parentId}`);
      } else {
        this.ux.error(feedItemCreateResult.message);
      }
      return feedItemCreateResult;

    }
  }
}

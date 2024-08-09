import { Category } from './category-model';

export type DocumentTypeCategory = Category;

export enum DocumentType {
    ExternalWebsite,
    ExternalFile,
    InternalFile,
    LocalFile
}
// todo: ftp ?, dropbox ?, google drive, tresorit, sharepoint, icloud, firebase, nextcloud etc. ?
// todo: this should be DocumentSourceType

// todo: and the DocumentType should be:  
// Plan, MarketingMaterial, Presentation, 
// Media, Certificate, Visa, SourceCode, Data, Archive,
// Standard, Report, Book, Article, Text, Newspaper, Magazine
// Minutes, Memo, Letter, Proposal, Study, Documentation, FAQ, Support
// Visual, Comics, Illustration, Design,
// HR: Application, JobDescription, CV, Request, Approval, TerminationLetter, Permission
// Legal: Contract, Offer, License, DPA, Patent, 
// Instruction, Guide, Regulation (Weisung)
// Finance: Accounting, Statement, Balance...

export const DocumentTypes: DocumentTypeCategory[] = [
  {
    id: DocumentType.ExternalWebsite,
    abbreviation: 'SITE',
    name: 'externalWebsite',
    i18nBase: 'document.type.externalWebsite',
    icon: 'globe-outline'
  },
  {
    id: DocumentType.ExternalFile,
    abbreviation: 'EXTF',
    name: 'externalFile',
    i18nBase: 'document.type.externalFile',
    icon: 'document-outline'
  },
  {
    id: DocumentType.InternalFile,
    abbreviation: 'INTF',
    name: 'internalFile',
    i18nBase: 'document.type.internalFile',
    icon: 'document-outline'
  },
  {
    id: DocumentType.LocalFile,
    abbreviation: 'LOCF',
    name: 'localFile',
    i18nBase: 'document.type.localFile',
    icon: 'document-outline'
  }
]

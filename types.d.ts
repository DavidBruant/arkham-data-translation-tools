type Card = {
    code: string,
    type_code: string,
    name?: string,
    slot: string,
    traits: string,
    text: string,
    flavor: string,
    back_name: string,
    back_text: string,
    back_flavor: string,
    is_unique: boolean,
}

type TranslatableProperty = 'name' | 'traits' | 'text' | 'flavor' | 'back_name' | 'back_flavor' | 'back_text'

type MissingTranslation = {
    referenceCard: Card,
    translationCard: Card,
    property: TranslatableProperty
}

type FileTranslationStatusMissingTranslations = { 
  packFilename: string; 
  referenceCards: Card[]; 
  missingTranslations: MissingTranslation[]; 
  translationCards: Card[]; 
} 

type FileTranslationStatusError = { 
  packFilename: string; 
  referenceCards: Card[]; 
  error: Error; 
}

type FileTranslationStatus = FileTranslationStatusMissingTranslations | FileTranslationStatusError;



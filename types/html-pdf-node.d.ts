declare module 'html-pdf-node' {
    interface PdfOptions {
        format?: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Tabloid';
        printBackground?: boolean;
        margin?: {
            top?: string | number;
            right?: string | number;
            bottom?: string | number;
            left?: string | number;
        };
        landscape?: boolean;
        preferCSSPageSize?: boolean;
        displayHeaderFooter?: boolean;
        headerTemplate?: string;
        footerTemplate?: string;
        pageRanges?: string;
    }

    interface FileInput {
        content?: string;
        url?: string;
    }

    function generatePdf(file: FileInput, options?: PdfOptions): Promise<Buffer>;
    function generatePdfs(files: FileInput[], options?: PdfOptions): Promise<Buffer[]>;

    export { FileInput, PdfOptions, generatePdf, generatePdfs };
}

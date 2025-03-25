import { MarkdownToHtmlStrategy } from "../services";
import markdownit from "markdown-it";

export class MarkdownItMarkdownToHtml implements MarkdownToHtmlStrategy {
    convert(raw: string): string {
        const md = markdownit();
        const result = md.render(raw);

        return result;
    }
}

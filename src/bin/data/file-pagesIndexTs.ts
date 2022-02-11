export const filePageIndexts = `import { ApplizePage } from "@aspulse/applize/lib/clientPage";
import { APISchema } from "../src/apiSchema";

export const index = new ApplizePage<APISchema>(adb => {
    adb.build('h1').text('Hello World!');
});
`;

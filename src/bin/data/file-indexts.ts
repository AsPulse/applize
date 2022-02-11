export const fileIndexts = `import { Applize, PageRoute } from "@aspulse/applize";
import { index } from "../pages/index";
import { APISchema } from "./apiSchema";

const applize = new Applize<APISchema>();

applize.addPageRoute(PageRoute.fromPage(index)?.urlRoute('/')?.code(200));

applize.run({});
`;

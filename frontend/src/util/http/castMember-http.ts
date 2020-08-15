import HttpResource from "./http-resource";
import {httpVideo} from "./index";

const categoryHttp = new HttpResource(httpVideo, "cast_members");

export default categoryHttp;
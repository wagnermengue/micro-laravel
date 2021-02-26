import HttpResource from "./http-resource";
import {httpVideo} from "./index";

const castMembersHttp = new HttpResource(httpVideo, "cast_members");

export default castMembersHttp;
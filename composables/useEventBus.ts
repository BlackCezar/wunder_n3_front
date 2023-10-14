import {ApplicationEvents} from "~/plugins/event-bus";
import mitt from "mitt";

const emitter = mitt<ApplicationEvents>()

export const useEvent = emitter.emit
export const useListen = emitter.on
import { onRequestGet as __api_counter_js_onRequestGet } from "C:\\Users\\Derrick Yu\\Downloads\\Semester 1\\Comp 140\\Recipe Formatter\\functions\\api\\counter.js"
import { onRequestPost as __api_counter_js_onRequestPost } from "C:\\Users\\Derrick Yu\\Downloads\\Semester 1\\Comp 140\\Recipe Formatter\\functions\\api\\counter.js"
import { onRequestGet as __api_python_code_js_onRequestGet } from "C:\\Users\\Derrick Yu\\Downloads\\Semester 1\\Comp 140\\Recipe Formatter\\functions\\api\\python_code.js"
import { onRequestPost as __api_python_code_js_onRequestPost } from "C:\\Users\\Derrick Yu\\Downloads\\Semester 1\\Comp 140\\Recipe Formatter\\functions\\api\\python_code.js"
import { onRequestPost as __api_users_js_onRequestPost } from "C:\\Users\\Derrick Yu\\Downloads\\Semester 1\\Comp 140\\Recipe Formatter\\functions\\api\\users.js"

export const routes = [
    {
      routePath: "/api/counter",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_counter_js_onRequestGet],
    },
  {
      routePath: "/api/counter",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_counter_js_onRequestPost],
    },
  {
      routePath: "/api/python_code",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_python_code_js_onRequestGet],
    },
  {
      routePath: "/api/python_code",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_python_code_js_onRequestPost],
    },
  {
      routePath: "/api/users",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_users_js_onRequestPost],
    },
  ]
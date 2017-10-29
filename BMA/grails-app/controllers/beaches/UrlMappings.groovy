package beaches

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(controller:"index")
        "/idx2"(view:"/index2")
        "500"(view:'/error')
        "404"(view:'/notFound')
        "/login/$action?"(controller: "login")
    }
}

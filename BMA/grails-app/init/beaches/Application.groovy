package beaches

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration

class Application extends GrailsAutoConfiguration {
    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }
}

//// Spring Security Email Configurations
//grails {
//    mail {
//        host = "smtp.gmail.com"
//        port = 465
//        username = "mushroommail@mtu.edu"
//        password = "actual-password"
//        props = ["mail.smtp.auth":"true",
//                 "mail.smtp.socketFactory.port":"465",
//                 "mail.smtp.socketFactory.class":"javax.net.ssl.SSLSocketFactory",
//                 "mail.smtp.socketFactory.fallback":"false"]
//    }
//}
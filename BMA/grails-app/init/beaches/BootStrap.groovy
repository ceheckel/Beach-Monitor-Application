package beaches

class BootStrap {

    def init = { servletContext ->
        // Add for creating Roles and Users
        def adminRole = new Role(authority: 'ROLE_ADMIN').save(flush: true)
        def userRole = new Role(authority: 'ROLE_USER').save(flush: true)
        //Bootstrap users
        def testAdmin = new User(username: 'admin', password: 'password')
        testAdmin.save(flush: true)

        def testUser = new User(username: 'user', password: 'password')
        testUser.save(flush: true)

        UserRole.create testAdmin, adminRole
        UserRole.create testUser, userRole

        UserRole.withSession {
            it.flush()
            it.clear()
        }
    }
}
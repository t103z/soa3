<template>
    <b-navbar variant="success" type="inverse" toggleable>

        <b-nav-toggle target="nav_collapse"></b-nav-toggle>

        <b-link class="navbar-brand" to="/">
            <span>Used Car Evaluation</span>
        </b-link>

        <b-collapse is-nav id="nav_collapse">

            <b-nav is-nav-bar class="ml-auto">

                <!-- Navbar dropdowns -->
                <b-nav-item-dropdown right-alignment>

                    <!-- Using text slot -->
                    <template slot="text">
                        <span style="font-weight: bold;">Account</span>
                    </template>

                    <b-dropdown-item to="register">Register</b-dropdown-item>
                    <b-dropdown-item to="login">Login</b-dropdown-item>
                </b-nav-item-dropdown>

            </b-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    export default {
      name: 'navigation'
    }
</script>

<template>
  <v-app id="login">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-0 pa-3">
              <v-card-text>
                <div class="layout column align-center logo">
                  <h1>Sistema de Cadastro</h1>
                </div>
                <v-row align="center" justify="center">
                  <v-col md="8">
                    <v-form ref="form">
                      <v-text-field
                        append-icon="mdi-account"
                        outlined
                        name="login"
                        label="Email"
                        type="text"
                        v-model="email"
                        @keyup.enter="submit"
                      />
                      <v-text-field
                        outlined
                        :type="hidePassword ? 'password' : 'text'"
                        :append-icon="hidePassword ? 'mdi-eye-off' : 'mdi-eye'"
                        name="password"
                        label="Senha"
                        id="password"
                        v-model="password"
                        @click:append="hidePassword = !hidePassword"
                        @keyup.enter="submit"
                      />
                    </v-form>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="action">
                <v-row align="center" justify="center">
                  <v-col md="8">
                    <v-btn
                      block
                      large
                      color="primary"
                      @click="submit"
                      :loading="loading"
                      :disabled="loading"
                      >Login</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-actions>
              <span class="error">
                <v-alert type="error" v-model="showError" dismissible> Não autorizado. </v-alert>
              </span>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Login",
  components: {},
  data: () => ({
    email: "",
    password: "",
    hidePassword: true,
    showError: false,
  }),
  methods: {
    ...mapActions(["LogIn"]),
    async submit() {
      const user = {
        email: this.email,
        password: this.password,
      };
      try {
        await this.LogIn(user);
        this.$router.push("/clientes");
        this.showError = false;
      } catch (error) {
        this.showError = true;
      }
    },
  },
  computed: {
    ...mapGetters({ loading: "loading" }),
  },
};
</script>

<style scoped>
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
.logo {
  margin-bottom: 5%;
}
.action {
  margin-top: -5%;
}
.error {
  margin-top: 5%;
}
</style>

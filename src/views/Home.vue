<template>
  <div>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Sistema de Cadastro</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <router-view/>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  methods: {
    async logout() {
      await this.$store.dispatch("LogOut");
      this.$router.push("/login");
    },
  },
};
</script>

<template>
  <v-container class="content" fill-height fluid>
    <v-row>
      <v-col>
        <h1>Cadastro de Clientes</h1>
      </v-col>
    </v-row>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form @submit.prevent="submit">
        <v-container>
          <v-row justify="space-between">
            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="Nome"
                rules="required|min:3"
              >
                <v-text-field
                  outlined
                  label="Nome"
                  required
                  :error-messages="errors"
                  v-model="cliente.nome"
                />
              </validation-provider>
            </v-col>
            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="Telefone"
                rules="required|phone"
              >
                <v-text-field
                  outlined
                  label="Telefone"
                  v-mask="'(##) #####-####'"
                  required
                  :error-messages="errors"
                  v-model="cliente.telefone"
                />
              </validation-provider>
            </v-col>
            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="Nascimento"
                rules="required|date"
                v-mask="'##/##/####'"
              >
                <v-text-field
                  outlined
                  label="Nascimento"
                  required
                  :error-messages="errors"
                  v-model="cliente.nascimento"
                />
              </validation-provider>
            </v-col>
            <v-col>
              <validation-provider
                name="Renda"
                rules="required"
                v-slot="{ errors }"
              >
                <v-currency-field
                  v-model="cliente.renda"
                  label="Renda"
                  :errors="errors"
                  :options="{ currency: 'BRL' }"
                />
              </validation-provider>
            </v-col>
            <v-col>
              <validation-provider
                v-slot="{ errors }"
                name="Status"
                rules="required"
              >
                <v-select
                  outlined
                  v-model="cliente.status"
                  :items="listaStatus"
                  :error-messages="errors"
                  label="Status"
                  required
                />
              </validation-provider>
            </v-col>
            <v-col>
              <v-btn x-large color="primary" :disabled="invalid" @click="submit">Salvar</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </validation-observer>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-text-field
              outlined
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
              v-model="filtro"
            />
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="clientes"
            :search="filtro"
            :footer-props="{
              itemsPerPageText: 'Itens por página',
              pageText: '{0}-{1} de {2}',
            }"
          >
            <template v-slot:[`item.renda`]="{ item }">
              {{ maskRenda(item.renda) }}
            </template>
            <template v-slot:[`item.acoes`]="{ item }">
              <v-icon
                class="mr-2"
                @click="update(item)">
                mdi-pencil
              </v-icon>
              <v-icon
                class="mr-2"
                @click="remove(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {required, min, numeric} from "vee-validate/dist/rules";
import {extend, ValidationObserver, ValidationProvider} from "vee-validate";
import VCurrencyField from "../components/VCurrencyField";

extend("required", {
  ...required,
  message: "campo obrigatório",
});

extend("min", {
  ...min,
  message: "mínimo {length} caracteres",
});

extend("numeric", {
  ...numeric,
  message: "não é um número",
});

extend("phone", {
  validate(value) {
    return /\(([0-9]){2}\) ([0-9]){5}-([0-9]){4}/.test(value);
  },
  message: "telefone inválido",
});

extend("date", {
  validate(value) {
    return /([0-9]){2}\/([0-9]){2}\/([0-9]){4}/.test(value);
  },
  message: "data inválida",
});

export default {
  name: "Clientes",
  components: {
    ValidationProvider,
    ValidationObserver,
    VCurrencyField,
  },
  data: () => ({
    cliente: {
      nome: undefined,
      telefone: undefined,
      nascimento: undefined,
      renda: undefined,
      status: undefined,
    },
    filtro: "",
    headers: [
      {
        text: "Id",
        align: "start",
        filterable: false,
        value: "id",
      },
      {
        text: "Nome",
        value: "nome",
      },
      {
        text: "Telefone",
        value: "telefone",
        filterable: false,
      },
      {
        text: "nascimento",
        value: "nascimento",
        filterable: false,
      },
      {
        text: "Renda",
        value: "renda",
        filterable: false,
      },
      {
        text: "Status",
        value: "status",
        filterable: false,
      },
      {
        text: 'Ações',
        value: 'acoes',
        align: 'center',
        filterable: false
      }
    ],
    listaStatus: ["Ativo", "Inativo"],
  }),
  created: function () {
    this.GetClients();
  },
  computed: {
    ...mapGetters({clientes: "StateClients"}),
  },
  methods: {
    ...mapActions(["CreateClient", "UpdateClient", "RemoveClient", "GetClients"]),
    async submit() {
      try {
        if(this.cliente.id) {
          await this.UpdateClient(this.cliente)
          await this.clear()
        } else {
          await this.CreateClient(this.cliente);
          await this.clear()
        }
      } catch (error) {
        throw "Erro ao salvar";
      }
    },
    async update(cliente) {
      this.cliente = JSON.parse(JSON.stringify(cliente));
    },
    async remove(cliente) {
      if(confirm("Deseja realmente deletar o cliente?")){
        await this.RemoveClient(cliente)
      }
    },
    maskRenda(renda) {
      return renda?.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
    },
    clear() {
      this.cliente = {
        nome: undefined,
        telefone: undefined,
        nascimento: undefined,
        renda: undefined,
        status: undefined,
      }
      this.$refs.observer.reset()
    }
  },
};
</script>

<style scoped>
.content {
  margin-top: 1%;
}
</style>

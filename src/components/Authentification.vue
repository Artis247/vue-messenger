<template>
    <form class="sign-up" @submit.prevent="auth">
        <div class="container">
            <div class="brand-logo"></div>
            <div class="brand-title">MESSENGER</div>
            <div class="inputs">
                <label for="name">Имя</label>
                <input v-model="profile.name" 
                type="text" placeholder="имя" />

                <label>ПАРОЛЬ</label>
                <input ref=""v-model="profile.password"
                       type="password"
                       placeholder="4 цифры"
                />
                <button type="submit">Авторизоваться</button>
            </div>
        </div>
    </form>
</template>
<script>
import store from "../store";
import firestore from '@/firebase/firestore'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: "authentification",
  data() {
    return {
      profile: {
        name: "",
        password: null,
      },
      authInfo:{
        profile:{
          name: "",
          password: 0
        },
        myself:{},
        contacts:[],
        messagesOld:[]
      },
      sortedTeam: [],
    };
  },

  computed: {
    ...mapGetters([
         "TEAM", 
        "messagesOld"
         ]),
    filteredTeam() {
      if (this.sortedTeam.length) {
        return this.sortedTeam;
      } else {
        return this.TEAM;
      }
    },
  },
  
  methods: {
    auth() {
      this.authInfo.profile.name = this.profile.name;
      this.authInfo.profile.password = this.profile.password;
      this.$emit("auth",this.authInfo);
    },
    ...mapActions([
                   "GET_TEAM_FROM_API",
                  "GET_MESSAGES_FROM_API"
    ]),
  },
  async mounted () {
                  await this.GET_TEAM_FROM_API();
                  await this.GET_MESSAGES_FROM_API();
  }
}
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;900&display=swap");

body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  background: #dbce72;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  place-items: center;
  overflow: hidden;
  font-family: poppins;
}

.container {
  position: relative;
  width: 350px;
  height: 500px;
  border-radius: 20px;
  padding: 40px;
  box-sizing: border-box;
  background: #ecf0f3;
  box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
}

.brand-logo {
  height: 100px;
  width: 100px;
  background: url("https://img.icons8.com/color/48/000000/myspace.png");
  margin: auto;
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 7px 7px 10px #cbced1, -7px -7px 10px white;
}

.brand-title {
  margin-top: 10px;
  font-weight: 900;
  font-size: 1.8rem;
  color: #1da1f2;
  letter-spacing: 1px;
}

.inputs {
  text-align: left;
  margin-top: 30px;
}

label,
input,
button {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  outline: none;
  box-sizing: border-box;
}

label {
  margin-bottom: 4px;
}

label:nth-of-type(2) {
  margin-top: 12px;
}

input::placeholder {
  color: gray;
}
select {
  background: #ecf0f3;
  padding: 10px;
  padding-left: 20px;
  height: 50px;
  font-size: 14px;
  border-radius: 50px;
  box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
}
input {
  background: #ecf0f3;
  padding: 10px;
  padding-left: 20px;
  height: 50px;
  font-size: 14px;
  border-radius: 50px;
  box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
}

button {
  margin-top: 20px;
  background: #1da1f2;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 900;
  box-shadow: 6px 6px 6px #cbced1, -6px -6px 6px white;
  transition: 0.5s;
}

button:hover {
  box-shadow: none;
}

a {
  position: absolute;
  font-size: 8px;
  bottom: 4px;
  right: 4px;
  text-decoration: none;
  color: black;
  background: yellow;
  border-radius: 10px;
  padding: 2px;
}

h1 {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

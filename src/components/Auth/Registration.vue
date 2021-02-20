<template lang='pug'>
  .content-wrapper
    section
      .container
        .auth
            .auth__banner
              h1.ui-title-2 by 1TGION
            .auth__form
              span.ui-title-2 Registration
              form(@submit.prevent="onSubmit")
                //- При неправильном вводе активируем класс errorInput
                .form-item(:class="{ errorInput: $v.email.$error }")
                  input(
                    type="email"
                    placeholder="Email"
                    v-model="email"
                    :class="{ error: $v.email.$error }" /** Класс ошибки дается, если выполняется условие любой ошибки (неправильного ввода) */
                    @change="$v.email.$touch()"
                  )
                  //- блок с классом ошибки появляется, если переменная email не прошла проверку
                  .error(v-if="!$v.email.required") Field is required
                  .error(v-if="!$v.email.email") Email is not correct

                .form-item(:class="{ errorInput: $v.password.$error }")
                  input(
                    type="password"
                    placeholder="Password"
                    v-model="password"
                    :class="{ error: $v.password.$error }"
                    @change="$v.password.$touch()"
                  )
                  .error(v-if="!$v.password.required") Password is required
                  .error(v-if="!$v.password.minLength") Password must have at least {{ $v.password.$params.minLength.min }}

                .form-item(:class="{ errorInput: $v.repeatPassword.$error }")
                  input(
                    type="password"
                    placeholder="Repeat your password"
                    v-model="repeatPassword"
                    :class="{ error: $v.repeatPassword.$error }"
                    @change="$v.repeatPassword.$touch()"
                  )
                  .error(v-if="!$v.repeatPassword.sameAsPassword") Passwords must be identical

                .buttons-list
                  button.button.button-primary(
                    type="submit"
                  )
                    span(v-if="loading") Loading...
                    span(v-else) Registration

                .buttons-list.buttons-list--info
                  p(v-if="submitStatus === 'OK'") Thanks for your submission!
                  p(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
                  p(else) {{ submitStatus }}
                  //- p.typo__p(v-if="submitStatus === 'PENDING'") Sending...

                .buttons-list.buttons-list--info
                  span Do you have account?
                    router-link(to="/login")  Enter Here

</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      submitStatus: null
    }
  },
  validations: {
    email: {
      required, // Показывает пусто или нет
      email // ПРоверяет на валидность email
    },
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    }
  },
  methods: {
    // Функция обновления статуса
    onSubmit () {
      this.$v.$touch() // Валидация всего
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        const user = {
          email: this.email,
          password: this.password
        }
        // Отправляем данные в registerUser (user.js)
        this.$store.dispatch('registerUser', user)
          .then(() => {
            localStorage.setItem('login', this.email)
            localStorage.setItem('auth', '1')
            console.log('REGISTER')
            this.submitStatus = 'OK'
            this.$router.push('/')
            // Перезагрузка для обновления
            location.reload()
          })
          .catch(err => {
            this.submitStatus = err.message
          })
        // this.submitStatus = 'PENDING'
        // setTimeout(() => {
        //   this.submitStatus = 'OK'
        // }, 500)
      }
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  }
}
// :class="{ error: $v.email.$error }"
// @change="v.email.$touch()"
// :class="{ errorInput: $v.email.$error }"
</script>

<style lang="stylus" scoped>
.auth
  display flex
  flex-wrap wrap // Переносим блоки на новую строку
.auth__banner,
.auth__form
  width 50%
  @media screen and (max-width: 768px)
    width 100%
    margin-bottom: 30px;
    &:last-child
      margin-bottom: 0

// Если добавлен класс ошибки ввода errorInput то показываем блок с ошибкой
.form-item
  .error
    display none
  &.errorInput
    .error
      display block
      margin-bottom: 8px;
      font-size 13.4px
      color #fc5c65

input
  &.error
    border-color #fc5c65
    animation shake .3s

.buttons-list
  text-align right
  margin-bottom 20px
  &.buttons-list--info
    text-align center
    &:last-child
      margin-bottom 0
a
  color #444ce0

.shake {
  animation-name: shake;
}

@keyframes shake {
  from, to {
    transform: translate3d(0, 0, 0);
  }

  10%, 30%, 50%, 70%, 90% {
    transform: translate3d(-4px, 0, 0);
  }

  20%, 40%, 60%, 80% {
    transform: translate3d(4px, 0, 0);
  }
}

</style>

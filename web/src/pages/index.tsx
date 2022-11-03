import Image from 'next/image'
import LocalCellNLW from '../assets/logo-cell-nlw.png'
import LogoImg from '../assets/logo.svg'
import UsersAvatarExampleImg from '../assets/users-example.png'
import IconCheckImg from '../assets/icon.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  
  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data
      await navigator.clipboard.writeText(code)

      setPoolTitle('')

      alert('Bolão criado com sucesso, o codigo foi copiado para sua área de transferência')


    } catch (error) {
      console.log(error)
      alert('Falha ai criar o bolao, tente novamente')
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={LogoImg}  alt="NLW Copa"/>

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={UsersAvatarExampleImg} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input 
            type="text" 
            placeholder='Qual nome do seu bolão?' 
            required 
            value={poolTitle}
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            onChange={event => setPoolTitle(event.target.value)}
          />
        
          <button 
            className='bg-yellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellow-700'
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>
      
        <div className='mt-10 pt-10 text-gray-100 border-t border-gray-600 flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Image src={IconCheckImg} alt="" />
            <div className='flex flex-col' >
              <span className='font-bold text-2xl' >+{poolCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className='flex items-center gap-6' >
            <Image src={IconCheckImg} alt="" />
            <div className='flex flex-col' >
              <span className='font-bold text-2xl' >+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={LocalCellNLW} 
        alt="Dois celulares exibindo uma previa da aplicação movel do NLW copa" 
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [
    poolCountResponse, 
    guessCountResponse, 
    userCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])
  
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { Formik, Form, ErrorMessage, Field } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/router'

const BACKEND_ADRESS = process.env.DATABASE_URL

export const getStaticProps = async () => {
  const members = await axios.get(`${BACKEND_ADRESS}/members`)
  
  return {
    props : {
      members : members.data
    }
  }
}

export default function Home({ members }) {
  const router = useRouter()
  const displayMembers = members.map((member, index) => {
    
    return (
      <p key={index} className={styles.column}>{member.name}</p>
    )
})


const MemberSchema = yup.object().shape({
  name: yup.string().required("Champ requis"),
});

const createMember = async (event) => {
  event.preventDefault()
 if(event.target[0].value === ""){
   return
 } else {
  let formData = {
    name: event.target[0].value
  };
  await axios.post(`http://localhost:5000/members/create`, {name: formData.name} )
        .then((res) => {
        })
        .catch((e)=> {
            console.log(e)
        })
        router.reload(window.location.pathname)
      }
}
 return (
<>
  <div className={styles.body}>
  {/* Header section */}
  <header className={styles.header}>
    <h1 className={styles.titleAlign}>
      <Image src="https://www.wildcodeschool.com/assets/logo_main-e4f3f744c8e717f1b7df3858dce55a86c63d4766d5d9a7f454250145f097c2fe.png" width={96} height={30} alt="Wild Code School logo" />
      Les Argonautes
    </h1>
  </header>

  {/* Main section */}
  <main className={styles.main}>
  {/* New member form */}
    <h2 className={styles.titleAlign}>Ajouter un(e) Argonaute</h2>

    <Formik
            initialValues={{
                name:''
            }}
            validationSchema={MemberSchema}>
                {() => (
            <div className={styles.container}>
                <Form onSubmit={createMember} className={styles.newMemberForm}>
                    <label htmlFor="name" className={styles.label}>Nom de l&apos;Argonaute</label>
                    <Field className={styles.input} id="name" name="name" type="text" placeholder="Charalampos" />
                    <button className={styles.button} type="submit">Envoyer</button>
                    <ErrorMessage  name="name" render={msg => <div className={styles.error}>{msg}</div>} />
                </Form>  
            </div>
                )}
    </Formik>
  {/* Member list */}
    <h2 className={styles.titleAlign}>Membres de l'équipage</h2>
    <section className={styles.row}>
      {displayMembers}
    </section>
  </main>
  </div>
</>
  )
}

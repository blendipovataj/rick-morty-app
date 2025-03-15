
import React, { useEffect, useState }  from 'react';
import './App.css';
import "./style.css";
import { gql, useQuery } from '@apollo/client';
import {useForm} from "react-hook-form";
import { useInView } from 'react-intersection-observer';
import "./i18n";
import { useTranslation } from 'react-i18next';





const GET_CHARACTERS  = gql`
    query GetCharacters($page: Int, $status: String, $species: String){
      characters(page: $page, filter: {status: $status, species: $species}){
      info {
        next
        prev
      }
      results {
        name
        status
        species
        gender
        origin { 
            name
          }
        image
      }
      }
      }  
`;

const App: React.FC = () => {
  
  
  const {register, handleSubmit} =useForm();
  const [filters, setFilters] = useState({status: "", species: "", sort:""});
  const [page, setPage] = useState(1);
  const [characters, setCharacters] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {t, i18n} = useTranslation();

  
  const { loading, error, data, fetchMore, refetch } = useQuery(GET_CHARACTERS, { 
    variables: {page, ...filters},
    onError: (err) => {
      setErrorMessage(` couldnt fetch data: ${err.message}`)
    },
  });

  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: "100px",
  });


  const onSubmit =(filterData: any) => {
    setFilters(filterData);
    setPage(1);
    setCharacters([]);
    setErrorMessage(null);
    refetch({ page:1, ...filterData});

  };

  useEffect(() => {
    if (inView && data?.characters.info.next) {
      fetchMore({
        variables: { page: page + 1, ...filters},
      })
      .then((newData) => {
        setCharacters((prev) => [...prev, ...newData.data.characters.results]);
        setPage(page + 1);
      })
      .catch((err) => {
        setErrorMessage(` could not load characters: ${err.message}`);
      })
    }
  }, [inView, data]);


  const sortCharacters = (characters: any[]) => {
    if (!filters.sort)
      return characters;
  

    return [...characters].sort((a, b) => {
      if (filters.sort === "name") {
        return a.name.localeCompare(b.name);
      }
      if (filters.sort ==="origin") {
        return a.origin.name.localeCompare(b.origin.name);
      }
      return 0;
    })

  }

  useEffect(() => {
    if (data) {
      setCharacters(data.characters.results);
    }
  }, [data]);

  if (error)
    return (
      <div style={{textAlign: "center", marginTop:"20px"}}>
        <h3>Error</h3>
        <p>{errorMessage}</p>
        <button onClick={() => refetch()}> Retry</button>
      </div>
    )

  const sortedCharacters = sortCharacters(characters);

    
  const changeLanguage = (lang: string)=> {
      i18n.changeLanguage(lang);
      console.log("language changed to:", lang);
    }
  

  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      Alive: t("Alive"),
      Dead: t("Dead"),
      unknown: t("Unknown"),
    };
    return translations[status] || status;
  }

  return (
    <div style={{padding: "70px", fontFamily:"Arial, sans-serif"}}>
       <div style={{textAlign:"right", marginBottom:"10px"}}>
        <label >{t("language")}</label>
        <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
       </div>
       <h1>{t("title")}</h1> 

      <form onSubmit={handleSubmit(onSubmit)} style={{marginBottom:"25px"}}>
        <label>{t("status:")}</label>
        <select {...register("status")}>
          <option value="">{t("All")}</option>
          <option value="Alive">{t("Alive")}</option>
          <option value="Dead">{t("Dead")}</option>
          <option value="unknown">Unknown</option>
        </select>

      <label>{t("species:")}</label>
      <input type="text" {...register("species")} placeholder={t('enterSpecies')} />

      <label>{t("sortBy:")}</label>
      <select {...register("sort")}>
        <option value="">{t("None")}</option>
        <option value="name">{t("Name")}</option>
        <option value="origin">{t("Origin")}</option>
      </select>

      <button type="submit">{t("apply")} </button>
      </form>

      <div className="characters-container" >
        {sortedCharacters.map((character: any) => (
          <div className="character-card" key={character.id} style={{ margin: "10px", textAlign: "center" }}>
            <img src={character.image} alt={character.name} width={100} height={100} />
            <p><strong>{character.name}</strong></p>
            <p>{t("status")}: {translateStatus(character.status)}</p>
            <p>{t("species")}: {translateStatus(character.species)}</p>
            <p>{t("Gender")}: {translateStatus(character.gender)}</p>
            <p>{t("Origin")}: {translateStatus(character.origin.name)}</p>
          </div>
        ))}
      </div>
        {data?.characters.info.next && (
          <div ref={ref} style={{ textAlign:"center", margin:" 20px 0"}}>
          <p>{t("loadingMore")}</p>
          </div>
        )}
    
    </div>
  );
};


export default App;



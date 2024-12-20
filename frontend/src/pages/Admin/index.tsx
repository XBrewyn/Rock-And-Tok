import React, { useEffect, useState } from 'react';
import { formatDate, send } from '../../tools/functions';
import style from './style.module.sass';

const Admin: React.FC = (): JSX.Element => {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const { response: { data } = {} } = await send({ api: 'student-get' }).get();
    if (data) {
      setStudents(data);
    }
  };

  return (
    <section className={style.table}>
      {students.length ? (
        <>
         {students.map(({ name, lastName, email, favoriteRockGenre, location, photo, test: { questions, dateStart } }) => (
        <div className={style.table__container}>
          <header>
            <ul>
              {photo && <li><img src={photo} width={50} height={50} /></li>}
              <li><span>Name:</span> {name} </li>
              <li><span>Last name:</span> {lastName} </li>
              <li><span>Email:</span> {email} </li>
              <li><span>Favorite Rock Genre:</span> {favoriteRockGenre}</li>
              <li><span>Location:</span> {location.city}, {location.region}, {location.country}</li>
              <li><span>Date start:</span> {formatDate(dateStart)}</li>   
            </ul>
          </header>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Student answer</th>
                <th>Response</th>
              </tr>
            </thead>
            {!!questions.length && (
              <tbody>
                {questions.map(({ studentAnswer, question, isCorrect, }: any) => (
                  <tr>
                    <td>{question}</td>
                    <td>{studentAnswer}</td>
                    <td>{isCorrect ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      ))}
        </>
      ): <h2>Aún no se ha registrado ningún estudiante.</h2>}
    </section>
  );
};

export default Admin;

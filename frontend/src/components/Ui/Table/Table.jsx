// import React from 'react';
// import styles from './Table.module.scss';
// import Link from 'next/link'
// import { encodeString, generateRandomChars } from '@/lib/utils';

// const DataTable = ({ columns, data, currentPage }) => {

//   return (
//     <table className={styles.table}>
//       <thead>
//         <tr>
//           {columns.map((column, index) => (
//             <th key={index}>{column.title}</th>
//           ))}
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, index) => (
//           <tr key={index}>
//             {Object.keys(item).map((key, index) => (
//               key !== "id" && key !== "random_chars" ?
//               <td key={index}>{item[key]}</td>
//               :
//               null
//             ))}
//             <td>
//                 <a className={styles.detailsButton} href={`./${currentPage}/${item.random_chars}${encodeString(item.id)}`}>
//                   View Details
//                 </a>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default DataTable;

import React, { useState } from 'react';
import styles from './Table.module.scss';
import Link from 'next/link';
import { encodeString, generateRandomChars } from '@/lib/utils';

const DataTable = ({ columns, data, currentPage, rowsPerPage = 5 }) => {
  // State for pagination
  const [page, setPage] = useState(1);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div>
      {/* Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.title}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              {Object.keys(item).map((key, idx) =>
                key !== 'id' && key !== 'random_chars' ? (
                  <td key={idx}>{item[key]}</td>
                ) : null,
              )}
              <td>
                <a
                  className={styles.detailsButton}
                  href={`./${currentPage}/${item.random_chars}${encodeString(
                    item.id,
                  )}`}
                >
                  Show
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`${styles.pageButton} ${
              page === index + 1 ? styles.activePage : ''
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={styles.pageButton}
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;

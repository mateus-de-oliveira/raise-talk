import React, { Fragment } from 'react'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import MUIDataTable from 'mui-datatables'
import Chip from '@material-ui/core/Chip'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import { usePropertieContext } from './Context'
import ModalCreate from './ModalCreate'
import ModalEdit from './ModalEdit'
import ModalDelete from './ModalDelete'
import Notification from './Notification'

const styles = (theme) => ({
  table: {
    '& > div': {
      overflow: 'auto',
    },
    '& table': {
      '& td': {
        wordBreak: 'keep-all',
      },
      [theme.breakpoints.down('md')]: {
        '& td': {
          height: 60,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
  },
})

function Propertie(props) {
  const {
    properties,
    data,
    loading,
    handleModalCreateOpen,
    handleModalEditOpen,
    handleDeleteOpen,
    setPropertieSelected,
    tablePricing,
    setProperties,
    setMessageNotification,
    setNotificationOpen,
    setTablePricing,
    setAvailability,
    availability,
    setFiles,
    setData,
  } = usePropertieContext()

  const columns = [
    {
      name: 'Name',
      options: {
        filter: true,
      },
    },

    {
      name: 'Status',
      options: {
        filter: true,
        customBodyRender: (value) => {
          if (value === true || value === 'true') {
            return <Chip label='Ativo' color='secondary' />
          }
          if (value !== true) {
            return <Chip label='Inativo' color='primary' />
          }
          return <Chip label='Unknown' />
        },
      },
    },
    {
      name: 'Data de criação',
      options: {
        filter: false,
      },
    },
    {
      name: 'Data de atualização',
      options: {
        filter: false,
      },
    },
    {
      name: 'Ações',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return (
            <>
              <IconButton
                aria-label='Edit'
                onClick={() => {
                  window.open(
                    encodeURI(
                      `https://api.whatsapp.com/send?text=${
                        window.location.origin
                      }/imoveis/${value}`
                    )
                  )
                }}
              >
                <i className='ion-ios-paper-plane' />
              </IconButton>
              <IconButton
                aria-label='Edit'
                onClick={() => {
                  axios.get('/api/properties/' + value).then((result) => {
                    setPropertieSelected(result.data)
                    setFiles(result.data.path_images)
                    setTablePricing(result.data.table_pricing)
                    setAvailability(result.data.availability)
                    handleModalEditOpen()
                  })
                  const result = properties.filter((item) => item.id === value)
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label='Delete'
                onClick={() => {
                  const result = properties.filter((item) => item.id === value)
                  setPropertieSelected(result)
                  handleDeleteOpen()
                }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )
        },
      },
    },
  ]

  const options = {
    filterType: 'dropdown',
    responsive: 'vertical',
    print: true,
    rowsPerPage: 10,
    page: 0,
    onRowsDelete: (dataRows) => {
      const dataId = dataRows.data.map((d) => {
        axios
          .delete('/api/properties', {
            data: { id: data[d.index][4] },
          })
          .then()
          .catch((error) => console.log(error))

        return data[d.index][4]
      })

      const aux = data.filter((x) => !dataId.includes(x[4]))

      const aux2 = properties.filter(function(item) {
        return dataId.indexOf(item.id) == -1
      })

      // const aux = data.filter((item) => dataId.includes(item.id))
      // const aux2 = properties.filter((item) => dataId.includes(item.id))

      setData(aux)
      setProperties(aux2)

      setMessageNotification('Imóveis deletados com sucesso!')
      setNotificationOpen(true)
    },
    textLabels: {
      body: {
        noMatch: 'Não foram encontrados registros para serem mostrados',
      },
      pagination: {
        next: 'Próxima página',
        previous: 'Página anterior',
        rowsPerPage: 'Linhas por página:',
        displayRows: 'de',
      },
      toolbar: {
        search: 'Pesquisar',
        downloadCsv: 'Download CSV',
        print: 'Print',
        viewColumns: 'Ver Colunas',
        filterTable: 'Filtrar Tabela',
      },
      filter: {
        all: 'All',
        title: 'FILTERS',
        reset: 'RESET',
      },
      viewColumns: {
        title: 'Mostrar Colunas',
        titleAria: 'Mostrar/Ocultar Tabela de Colunas',
      },
      selectedRows: {
        text: 'linhas(s) selecionada',
        delete: 'Excluir',
        deleteAria: 'Excluir linhas selecionadas',
      },
    },
  }

  const { classes } = props

  return loading ? (
    <CircularProgress
      style={{ display: 'block', margin: '0 auto' }}
      color='secondary'
    />
  ) : (
    <Fragment>
      <Button
        variant='contained'
        color='primary'
        style={{ display: 'block', margin: '0 auto 20px auto' }}
        onClick={handleModalCreateOpen}
      >
        CADASTRAR IMÓVEL
      </Button>
      <ModalCreate />
      <ModalEdit />
      <ModalDelete />
      <Notification />
      <div className={classes.table}>
        <MUIDataTable
          title='Tabela de imóveis'
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    </Fragment>
  )
}

export default withStyles(styles)(Propertie)

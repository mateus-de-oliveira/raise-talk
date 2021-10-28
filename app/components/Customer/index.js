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
import Tooltip from '@material-ui/core/Tooltip'
import { useCustomerContext } from './Context'
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

function Customer(props) {
  const {
    properties,
    customers,
    data,
    setData,
    loading,
    handleModalCreateOpen,
    handleModalEditOpen,
    handleDeleteOpen,
    setPropertieSelected,
    setCustomerSelected,
    setCustomers,
    setNotificationOpen,
    setMessageNotification,
  } = useCustomerContext()

  const columns = [
    {
      name: 'Nome',
      options: {
        filter: true,
      },
    },
    {
      name: 'Número',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return (
            <>
              {value}
              {/* <span>{value.replace(/[^a-z0-9]/gi, '')}</span>
              <Tooltip
                disableFocusListener
                id={`tooltip-top-${value}`}
                title='Add'
                placement='top'
              >
                <IconButton
                  aria-label='whatsapp'
                  onClick={() => {
                    navigator.clipboard.writeText(value)
                  }}
                >
                  <i className='ion-ios-copy-outline' />
                </IconButton>
              </Tooltip> */}
            </>
          )
        },
      },
    },
    {
      name: 'Status',
      options: {
        filter: true,
        customBodyRender: (value) => {
          if (value === 101) {
            return (
              <Chip
                label='Lead'
                style={{ backgroundColor: '#e67e22', color: '#fff' }}
              />
            )
          }
          if (value === 102) {
            return (
              <Chip
                label='Atendimento'
                style={{ backgroundColor: '#6412BC', color: '#fff' }}
              />
            )
          }
          if (value === 103) {
            return (
              <Chip
                label='Agendamento'
                style={{ backgroundColor: '#3498db', color: '#fff' }}
              />
            )
          }
          if (value === 104) {
            return (
              <Chip
                label='Visita'
                style={{ backgroundColor: '#9b59b6', color: '#fff' }}
              />
            )
          }
          if (value === 105) {
            return (
              <Chip
                label='Proposta'
                style={{ backgroundColor: '#e74c3c', color: '#fff' }}
              />
            )
          }
          if (value === 106) {
            return (
              <Chip
                label='Fechamento'
                style={{ backgroundColor: '#2ecc71', color: '#fff' }}
              />
            )
          }
          return <Chip label='Sem Status' />
        },
      },
    },
    {
      name: 'Data de Criação',
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
                aria-label='whatsapp'
                onClick={() => {
                  const result = customers.filter((item) => item.id === value)

                  window.open(
                    `https://api.whatsapp.com/send?phone=55${result[0].number.replace(
                      /[^a-z0-9]/gi,
                      ''
                    )}`
                  )
                }}
              >
                <i className='ion-logo-whatsapp' />
              </IconButton>
              <IconButton
                aria-label='Edit'
                onClick={() => {
                  const result = customers.filter((item) => item.id === value)
                  setCustomerSelected(result[0])
                  handleModalEditOpen()
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label='Delete'
                onClick={() => {
                  const result = customers.filter((item) => item.id === value)
                  setCustomerSelected(result)
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
          .delete('/api/customers', {
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
      setCustomers(aux2)

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
        CADASTRAR CLIENTE
      </Button>
      <ModalCreate />
      <ModalEdit />
      <ModalDelete />
      <Notification />
      <div className={classes.table}>
        <MUIDataTable
          title='Tabela de clientes'
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    </Fragment>
  )
}

export default withStyles(styles)(Customer)

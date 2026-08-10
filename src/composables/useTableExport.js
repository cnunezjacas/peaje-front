// src/composables/useTableExport.js
import { useNotify } from 'src/utils/notify/notify.js'
const { notify_success, notify_error } = useNotify()
import { STRINGS } from 'utils/string.js'
import * as XLSX from 'xlsx'

/* ================================================ */
/* ==== Exportar a Excel (.xlsx) ==== */
/* ================================================ */
export function useTableExport() {
  const exportToExcel = async (data, columns, filename = 'export') => {
    try {
      // 1. Preparar datos: solo las columnas visibles
      const exportData = data.map((row) => {
        const exportRow = {}
        columns
          .filter((col) => col.field && col.visible !== false)
          .forEach((col) => {
            let value = row[col.field]
            // Aplicar formato si existe
            if (col.format && typeof col.format === 'function') {
              value = col.format(value, row)
            }
            exportRow[col.label || col.field] = value
          })
        return exportRow
      })

      // 2. Crear worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // 3. Ajustar ancho de columnas (opcional)
      const colWidths = columns
        .filter((col) => col.visible !== false)
        .map((col) => ({
          wch: Math.max((col.label || col.field).length, 15),
        }))
      worksheet['!cols'] = colWidths

      // 4. Crear workbook y descargar
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos')
      XLSX.writeFile(workbook, `${filename}.xlsx`)
      return { success: true, filename: `${filename}.xlsx` }
    } catch (error) {
      console.error('❌ Error exportando a Excel:', error)
      //notify_error(STRINGS.exportError || 'Error al exportar')
      return { success: false, error: error.message }
    }
  }

  /* ================================================ */
  /* ==== Exportar a CSV (más simple, nativo) ==== */
  /* ================================================ */
  const exportToCSV = (data, columns, filename = 'export') => {
    try {
      // Preparar headers
      const headers = columns
        .filter((col) => col.field && col.visible !== false)
        .map((col) => col.label || col.field)

      // Preparar filas
      const rows = data.map((row) => {
        return columns
          .filter((col) => col.field && col.visible !== false)
          .map((col) => {
            let value = row[col.field]
            if (col.format && typeof col.format === 'function') {
              value = col.format(value, row)
            }
            // Escapar comas y saltos de línea para CSV
            return `"${String(value).replace(/"/g, '""')}"`
          })
          .join(',')
      })

      // Unir todo
      const csvContent = [headers.join(','), ...rows].join('\n')

      // Descargar
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${filename}.csv`
      link.click()

      notify_success(STRINGS.exportSuccess || 'Exportación exitosa')
      return true
    } catch (error) {
      console.error('❌ Error exportando a CSV:', error)
      notify_error(STRINGS.exportError || 'Error al exportar')
      return false
    }
  }

  /* ================================================ */
  /* ==== Exportar a PDF ==== */
  /* ================================================ */

  const exportToPDF = async (data, columns, filename = 'export', title = 'Reporte') => {
    try {
      // 🔥 IMPORTACIÓN CORRECTA para jspdf-autotable
      const jsPDFModule = await import('jspdf')
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default

      // 🔥 Importar y REGISTRAR el plugin autoTable
      const autoTableModule = await import('jspdf-autotable')
      const autoTable = autoTableModule.default || autoTableModule

      // 🔥 Registrar el plugin en jsPDF (CRUCIAL)
      autoTable(jsPDF)

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      // Título
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 14, 20)

      // Preparar columnas y datos para autoTable
      const tableColumns = columns
        .filter((col) => col.field && col.visible !== false)
        .map((col) => ({
          header: col.label || col.field,
          dataKey: col.field,
        }))

      const tableRows = data.map((row) => {
        const rowData = {}
        columns
          .filter((col) => col.field && col.visible !== false)
          .forEach((col) => {
            let value = row[col.field]
            if (col.format && typeof col.format === 'function') {
              value = col.format(value, row)
            }
            rowData[col.field] = value
          })
        return rowData
      })

      // 🔥 Generar tabla con autoTable (sintaxis correcta)
      doc.autoTable({
        columns: tableColumns,
        body: tableRows,
        startY: 30,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [76, 175, 80], // Verde Quasar
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 'auto' }, // Primera columna auto-ajustable
        },
      })

      // Descargar
      doc.save(`${filename}.pdf`)

      notify_success(STRINGS.exportSuccess || 'Exportación exitosa')
      return true
    } catch (error) {
      console.error('❌ Error exportando a PDF:', error)
      notify_error(STRINGS.exportError || 'Error al exportar a PDF')
      return false
    }
  }

  return {
    exportToExcel,
    exportToCSV,
    exportToPDF,
  }
}

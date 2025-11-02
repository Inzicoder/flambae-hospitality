import React, { useState } from 'react';
import * as XLSX from 'xlsx';

// Define the type for Excel row data
interface ExcelRow {
  [key: string]: string | number | boolean | Date;
}

const EventReader: React.FC = () => {
  const [data, setData] = useState<ExcelRow[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>): void => {
      const binaryStr = event.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      
      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".xlsx,.xls" 
        onChange={handleFileUpload} 
      />
      <div>
        {data.map((row: ExcelRow, index: number) => (
          <div key={index}>{JSON.stringify(row)}</div>
        ))}
      </div>
    </div>
  );
};

export default EventReader;
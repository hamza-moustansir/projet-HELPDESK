import React, { useCallback } from 'react';
import { Input } from '../ui/input';
import { useDebounce } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';

export default function TableSearchInput({
  placeholder
}: {
  placeholder?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = React.useState(search);
  const [debouncedValue] = useDebounce(searchTerm, 1000);

  const handleSettingSearchParams = useCallback((newSearchValue: string) => {
    if (newSearchValue === '' || newSearchValue === undefined || !newSearchValue) {
      searchParams.delete('search');
      setSearchParams(searchParams);
      return;
    }
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: '1', // Reset to first page
      search: newSearchValue // Update search value
    });
  }, [searchParams, setSearchParams]);

  React.useEffect(() => {
    handleSettingSearchParams(debouncedValue);
  }, [debouncedValue, handleSettingSearchParams]);

  return (
    <Input
      placeholder={placeholder || `Search by name...`}
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      className="w-full md:max-w-sm"
    />
  );
}

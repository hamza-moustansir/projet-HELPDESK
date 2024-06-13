import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { getTags } from '@/services/tags/tagSlice';

export default function TagFilter({
  onChange
}: {
  onChange: (tags: string[]) => void;
}) {
  const dispatch: AppDispatch = useDispatch();
  const tags = useSelector((state: RootState) => state.tag.tags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  const handleTagChange = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onChange(newTags);
  };

  return (
    <div className="w-full md:max-w-sm">
      <Select onValueChange={handleTagChange} multiple>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter by tags" />
        </SelectTrigger>
        <SelectContent>
          {tags.map(tag => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

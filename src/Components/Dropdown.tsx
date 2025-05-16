import { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { filterPersons } from '../utils/filterPersons';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const filteredPeople = useMemo(() => {
    return normalizedQuery ? filterPersons(people, normalizedQuery) : people;
  }, [people, normalizedQuery]);

  const handleInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newQuery = event.target.value;

    setInputValue(newQuery);
    onSelected(null);
  };

  const handlePersonSelect = (person: Person) => {
    onSelected(person);
    setInputValue(person.name);
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    const debounced = debounce(() => {
      setDebouncedQuery(inputValue);
    }, delay);

    debounced();

    return () => debounced.cancel();
  }, [inputValue, delay]);

  return (
    <div className={classNames('dropdown', { 'is-active': isDropdownVisible })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => setIsDropdownVisible(false)}
          onChange={handleInputValueChange}
          value={inputValue}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={() => handlePersonSelect(person)}
              >
                <p
                  className={`has-text-${person.sex === 'm' ? 'link' : 'danger'}`}
                >
                  {person.name}
                </p>
              </div>
            ))
          ) : (
            <div
              className="notification is-danger is-light mt-3 mb-0"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

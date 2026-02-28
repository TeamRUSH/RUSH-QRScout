import { Button } from '@/components/ui/button';
import { useEvent } from '@/hooks';
import { inputSelector, updateValue, useQRScoutState } from '@/store/store';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft }  from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { doubleInputData } from './BaseInputProps';
import { ConfigurableInputProps } from './ConfigurableInput';

export default function DecCounterInput(props: ConfigurableInputProps) {
  const data = useQRScoutState(
    inputSelector<doubleInputData>(props.section, props.code),
  );

  if (!data) {
    return <div>Invalid input</div>;
  }

  const [value, setValue] = useState(data.defaultValue);

  const resetState = useCallback(
    ({ force }: { force: boolean }) => {
      if (force) {
        setValue(data.defaultValue);
        return;
      }
      switch (data.formResetBehavior) {
        case 'reset':
          setValue(data.defaultValue);
          return;
        case 'increment':
          setValue(prev => (typeof prev === 'number' ? prev + data.step1 : 1));
          return;
        case 'preserve':
          return;
        default:
          return;
      }
    },
    [value],
  );

  useEvent('resetFields', resetState);

  const handleChange = useCallback(
    (increment: number) => {
      const newVal = value + increment;
      if (data.max !== undefined && newVal > data.max) {
        // Don't fire the event if the new value would be greater than the max
        return;
      }
      if (data.min !== undefined && newVal < data.min) {
        // Don't fire the event if the new value would be less than the min
        return;
      }
      setValue(newVal);
    },
    [data.max, data.min, value],
  );

  useEffect(() => {
    updateValue(props.code, value);
  }, [value]);

  return (
    <div className="my-2 flex flex-row items-center justify-center">
      <Button onClick={() => handleChange(-(data.step2 || 5))}>
        <ChevronsLeft />
      </Button>
      <Button onClick={() => handleChange(-(data.step1 || 1))}>
        <ChevronLeft />
      </Button>
      <h2 className="px-4 text-2xl dark:text-white">{value}</h2>
      <Button onClick={() => handleChange(data.step1 || 1)}>
        <ChevronRight />
      </Button>
      <Button onClick={() => handleChange(data.step2 || 5)}>
        <ChevronsRight />
      </Button>
    </div>
  );
}

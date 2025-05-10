import { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = ({ ...props }: TextAreaProps) => {
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="text-area" className="text-white">
        Deixe seu comentário
      </label>
      <textarea {...props} />
    </div>
  );
};

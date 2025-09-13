interface ImcErrorProps {
  error: string;
}

function ImcError({ error }: ImcErrorProps) {
  return (
    <div className="alert alert-danger mt-3" role="alert">
      {error}
    </div>
  );
}

export default ImcError;

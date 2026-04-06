import { NextPageContext } from 'next';

function Error({ statusCode }: { statusCode: number }) {
    return (
        <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>
            <p>{statusCode ? `שגיאה ${statusCode}` : 'שגיאה'}</p>
        </div>
    );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;

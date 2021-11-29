const Footer = () => {
  const currentYear: number = new Date().getFullYear()

  return (
    <footer className="w-full mb-8 text-center">
      <div className="container mx-auto">
        <div>
          Powered by{' '}
          <a className="link" href="https://nextjs.org/">
            Next.js
          </a>
          ,{' '}
          <a className="link" href="https://tailwindcss.com/">
            Tailwind CSS
          </a>
          ,{' '}
          <a className="link" href="https://notion.so">
            Notion
          </a>{' '}
          and{' '}
          <a className="link" href="https://www.typescriptlang.org/">
            TypeScript.
          </a>
          <a className="hover:text-white" href="https://beian.miit.gov.cn/">
            浙ICP备19039496号-1
          </a>
        </div>
        <div>Ivyxjc © 2016-{currentYear}</div>
      </div>
    </footer>
  )
}

export default Footer

import { Badge, Box, Flex, chakra } from '@chakra-ui/react'
import { SkipNavContent, SkipNavLink } from '@chakra-ui/skip-nav'
import { useRouter } from 'next/router'
import * as React from 'react'
import { AdBanner } from './chakra-pro/ad-banner'
import EditPageLink from 'components/edit-page-button'
import Footer from 'components/footer'
import Header from 'components/header'
import SEO from 'components/seo'
import TableOfContent from 'components/table-of-content'
import { convertBackticksToInlineCode } from 'utils/convert-backticks-to-inline-code'
import { t } from 'utils/i18n'
import { FrontmatterHeading } from 'src/types/frontmatter'

function useHeadingFocusOnRouteChange() {
  const router = useRouter()

  React.useEffect(() => {
    const onRouteChange = () => {
      const [heading] = Array.from(document.getElementsByTagName('h1'))
      heading?.focus()
    }
    router.events.on('routeChangeComplete', onRouteChange)
    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [router.events])
}

interface PageContainerProps {
  frontmatter: {
    slug?: string
    title: string
    description?: string
    editUrl?: string
    version?: string
    headings?: FrontmatterHeading[]
  }
  hideToc?: boolean
  maxWidth?: string
  children: React.ReactNode
  sidebar?: React.ReactElement
  pagination?: React.ReactElement
}

function PageContainer(props: PageContainerProps) {
  const {
    frontmatter,
    children,
    sidebar,
    pagination,
    hideToc,
    maxWidth = '48rem',
  } = props

  useHeadingFocusOnRouteChange()

  if (!frontmatter) return <></>

  const { title, description, editUrl, version, headings = [] } = frontmatter

  return (
    <>
      <SEO title={title} description={description} />
      <SkipNavLink zIndex={20}>
        {t('component.page-container.skip-to-content')}
      </SkipNavLink>
      <AdBanner />
      <Header />
      <Box as='main' className='main-content' w='full' maxW='8xl' mx='auto'>
        <Box display={{ md: 'flex' }}>
          {sidebar || null}
          <Box flex='1' minW='0'>
            <SkipNavContent />
            <Box id='content' px={5} mx='auto' minH='76vh'>
              <Flex>
                <Box
                  minW='0'
                  flex='auto'
                  px={{ base: '4', sm: '6', xl: '8' }}
                  pt='10'
                >
                  <Box maxW={maxWidth}>
                    <chakra.h1 tabIndex={-1} outline={0} apply='mdx.h1'>
                      {convertBackticksToInlineCode(title)}
                    </chakra.h1>
                    {version && (
                      <Badge colorScheme='teal' letterSpacing='wider'>
                        v{version}
                      </Badge>
                    )}
                    {children}
                    <Box mt='40px'>
                      <Box>{editUrl && <EditPageLink href={editUrl} />}</Box>
                      {pagination || null}
                    </Box>
                    <Box pb='20'>
                      <Footer />
                    </Box>
                  </Box>
                </Box>
                {!hideToc && (
                  <TableOfContent
                    visibility={headings.length === 0 ? 'hidden' : 'initial'}
                    headings={headings}
                  />
                )}
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default PageContainer

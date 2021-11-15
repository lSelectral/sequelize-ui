import { fileLanguage, FileSystemItem, isDirectory, isFile, itemName } from '@src/core/files'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import ChevronIcon, { ChevronDirection } from '../icons/Chevron'
import LanguageIcon from '../icons/Language'
import { FolderState } from './types'

type FileTreeProps = {
  root: FileSystemItem
  activePath?: string
  folderState: FolderState
  onSelect: (path: string) => void
}
function FileTree({ root, activePath, folderState, onSelect }: FileTreeProps): React.ReactElement {
  return (
    <ul className={classnames('whitespace-nowrap', 'overflow-x-scroll')}>
      <li>
        <FileTreeItem
          depth={1}
          item={root}
          folderState={folderState}
          onSelect={onSelect}
          activePath={activePath}
          path={itemName(root)}
        />
      </li>
    </ul>
  )
}

type FileTreeItemProps = {
  item: FileSystemItem
  folderState: FolderState
  activePath?: string
  path: string
  onSelect: (path: string) => void
  depth: number
}
function FileTreeItem({
  depth,
  activePath,
  item,
  path,
  folderState,
  onSelect,
}: FileTreeItemProps): React.ReactElement {
  const active = activePath === path
  const handleClick = () => onSelect(path)

  React.useEffect(() => {
    if (activePath) {
      const li = document.getElementById(pathId(activePath))
      if (li) li.scrollIntoView({ block: 'center', behavior: 'auto' })
    }
  }, [])

  const language = isFile(item) && fileLanguage(item)
  const chevronDirection = !isDirectory(item)
    ? undefined
    : folderState[path]
    ? ChevronDirection.Down
    : ChevronDirection.Right

  return (
    <>
      <button
        type="button"
        className={classnames(
          'flex',
          'items-center',
          'text-sm',
          'leading-loose',
          'w-full',
          'cursor-pointer',
          'block',
          { 'font-semibold': active, 'hover:bg-gray-200': !active, 'bg-indigo-100': active },
        )}
        style={{ paddingLeft: `calc(${depth} * 1rem)` }}
        onClick={handleClick}
      >
        {chevronDirection && (
          <span className="pr-1.5">
            <ChevronIcon direction={chevronDirection} />
          </span>
        )}
        {language && (
          <span className="pr-1.5">
            <LanguageIcon language={language} />
          </span>
        )}
        {itemName(item)}
      </button>
      {isDirectory(item) && item.files.length > 0 && folderState[path] && (
        <ul>
          {item.files
            .slice()
            .sort(compareItems)
            .map((item) => {
              const newPath = path + '/' + itemName(item)

              return (
                <li id={pathId(newPath)} key={itemName(item)}>
                  <FileTreeItem
                    depth={depth + 1}
                    item={item}
                    onSelect={onSelect}
                    path={newPath}
                    activePath={activePath}
                    folderState={folderState}
                  />
                </li>
              )
            })}
        </ul>
      )}
    </>
  )
}

function compareItems(a: FileSystemItem, b: FileSystemItem): number {
  if (isDirectory(a) && isFile(b)) return -1
  if (isDirectory(b) && isFile(a)) return 1
  return itemName(a).localeCompare(itemName(b))
}

function pathId(path: string): string {
  return path.replace(/\W/g, '-')
}

export default React.memo(FileTree)

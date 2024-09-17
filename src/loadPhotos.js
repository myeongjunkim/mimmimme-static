import { Client } from '@notionhq/client';

const fetchNotionPhotoes = async () => {
  try {
    const notion = new Client({ auth: import.meta.env.VITE_NOTION_API_KEY });
    const databaseId = String(import.meta.env.VITE_NOTION_DATABASE_ID);
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'timeline',
        select: { equals: 'History' },
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function loadPhotos() {
    const photoData = await fetchNotionPhotoes();
    const board = document.getElementById('fh5co-board');

    console.log(photoData);

    photoData.results.forEach(item => {
        const photoUrl = item.properties.Photo.files[0]?.file.url;
        const description = item.properties.Description.rich_text[0]?.plain_text;

        if (photoUrl) {
            const itemHtml = `
                <div class="item">
                    <div class="animate-box">
                        <a href="${photoUrl}" class="image-popup fh5co-board-img">
                            <img src="${photoUrl}" alt="Photo from Notion">
                        </a>
                        <div class="fh5co-desc">${description || 'No description'}</div>
                    </div>
                </div>
            `;
            board.insertAdjacentHTML('beforeend', itemHtml);
        }
    });

    // Salvattore 레이아웃 업데이트
    salvattore.recreateColumns(board);
}

document.addEventListener('DOMContentLoaded', loadPhotos);

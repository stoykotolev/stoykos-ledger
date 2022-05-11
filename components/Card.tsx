import { PostPreviewType } from '../utils/types';
import NextLink from './NextLink';

const Card = ({
  title, date, id, snippet
}: PostPreviewType) =>
  (
    <div className='card'>
      <div className='card-text'>
        <h2 className='card-title'>{title}</h2>
        <p className='card-date'>{date}</p>
        <p className='card-description'>
          <span>{snippet}</span>
        </p>
        <NextLink href={`posts/${id}`}>Read More</NextLink>
      </div>
    </div>
  );

export default Card;

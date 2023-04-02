export default function Previous(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-chevron-left"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      stroke-width="0.5"
      stroke="#acaea9"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      onClick={props.onClick}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="15 6 9 12 15 18" />
    </svg>
  );
}
